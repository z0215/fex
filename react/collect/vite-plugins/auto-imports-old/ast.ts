import { uniqBy } from 'lodash-es'
import type { Declaration, InterfaceDeclaration, Node, TypeAliasDeclaration } from 'typescript'
import {
  ModifierFlags,
  createProgram,
  getCombinedModifierFlags,
  getJSDocTags,
  isClassDeclaration,
  isExportAssignment,
  isExportDeclaration,
  isFunctionDeclaration,
  isIdentifier,
  isInterfaceDeclaration,
  isModuleBlock,
  isModuleDeclaration,
  isNamedExports,
  isNamespaceExportDeclaration,
  isSourceFile,
  isTypeAliasDeclaration,
  isVariableDeclaration,
  isVariableStatement,
} from 'typescript'

const isExported = (node: Node) => {
  const flags = getCombinedModifierFlags(node as Declaration)

  // Check if the node has export modifier
  if (flags & ModifierFlags.Export) {
    return true
  }

  // Check if the node is a default export
  if (node.parent && isSourceFile(node.parent)) {
    if (flags & ModifierFlags.Default) {
      return true
    }
  }

  return false
}

const isDeprecated = (node: Node) => {
  const jsDocTags = getJSDocTags(node)
  return jsDocTags.some(tag => tag.tagName.getText() === 'deprecated')
}

export interface ExportedInfoItem {
  name: string
  parameter?: { name: string, isDefault: boolean }[]
}

export interface ExportedInfo {
  values: ExportedInfoItem[]
  types: ExportedInfoItem[]
}

export const getExportedInfo = (filename?: string) => {
  const results: ExportedInfo = {
    values: [],
    types: [],
  }

  if (!filename)
    return results

  const program = createProgram([filename], {})
  const checker = program.getTypeChecker()
  const sourceFile = program.getSourceFile(filename)

  if (!sourceFile)
    return results

  const visit = (node: Node, inNamespace = false) => {
    if (isDeprecated(node))
      return

    if (isModuleDeclaration(node)) {
      return
    }

    if (isNamespaceExportDeclaration(node)) {
      sourceFile.forEachChild((space) => {
        if (isModuleDeclaration(space) && space.name.text === node.name.text) {
          if (space.body && isModuleBlock(space.body)) {
            visit(space.body, true)
          }
        }
      })
    }
    else if (isExportAssignment(node)) {
      const symbol = checker.getSymbolAtLocation(node.expression)
      if (symbol) {
        symbol.declarations?.forEach((declaration) => {
          if (isTypeAliasDeclaration(declaration) || isInterfaceDeclaration(declaration)) {
            results.types.push({
              name: symbol.getName(),
              parameter: declaration.typeParameters?.map(param => ({ name: param.name.text, isDefault: !!param.default })),
            })
          }
          else {
            results.values.push({
              name: symbol.getName(),
            })
          }
        })
      }
    }
    else if (isExportDeclaration(node) && node.exportClause && isNamedExports(node.exportClause)) {
      node.exportClause.elements.forEach((element) => {
        const symbol = checker.getSymbolAtLocation(element.name)
        if (symbol) {
          symbol.declarations?.forEach((declaration) => {
            if (node.isTypeOnly || isTypeAliasDeclaration(declaration) || isInterfaceDeclaration(declaration)) {
              results.types.push({
                name: symbol.getName(),
                parameter: (declaration as TypeAliasDeclaration | InterfaceDeclaration).typeParameters?.map(param => ({ name: param.name.text, isDefault: !!param.default })),
              })
            }
            else {
              results.values.push({
                name: symbol.getName(),
              })
            }
          })
        }
      })
    }
    else if (isVariableStatement(node)) {
      if (!inNamespace && !isExported(node))
        return
      node.declarationList.declarations.forEach((declaration) => {
        if (isVariableDeclaration(declaration) && isIdentifier(declaration.name)) {
          results.values.push({
            name: declaration.name.text,
          })
        }
      })
    }
    else if (isFunctionDeclaration(node) && node.name) {
      if (!inNamespace && !isExported(node))
        return
      results.values.push({
        name: node.name.text,
      })
    }
    else if (isClassDeclaration(node) && node.name) {
      if (!inNamespace && !isExported(node))
        return
      results.values.push({
        name: node.name.text,
      })
    }
    else if (isInterfaceDeclaration(node)) {
      if (!inNamespace && !isExported(node))
        return
      results.types.push({
        name: node.name.text,
        parameter: node.typeParameters?.map(param => ({ name: param.name.text, isDefault: !!param.default })),
      })
    }
    else if (isTypeAliasDeclaration(node)) {
      if (!inNamespace && !isExported(node))
        return
      results.types.push({
        name: node.name.text,
        parameter: node.typeParameters?.map(param => ({ name: param.name.text, isDefault: !!param.default })),
      })
    }

    node.forEachChild(item => visit(item, inNamespace))
  }

  visit(sourceFile)

  return {
    values: uniqBy(results.values, 'name'),
    types: uniqBy(results.types, 'name'),
  }
}
