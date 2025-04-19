import type {
  BarSeriesOption,
  LineSeriesOption,
  PieSeriesOption,
  RadarSeriesOption,
} from 'echarts/charts'
import type {
  GridComponentOption,
  LegendComponentOption,
  TooltipComponentOption,
} from 'echarts/components'
import type {
  ComposeOption,
  ECharts,
} from 'echarts/core'
import type { HTMLAttributes } from 'react'
import {
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
} from 'echarts/charts'
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components'
import {
  use as addFeatures,
  init,
} from 'echarts/core'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

addFeatures([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
])

export interface ChartLineProps extends HTMLAttributes<HTMLDivElement> {
  options: ComposeOption<
    | TooltipComponentOption
    | GridComponentOption
    | LegendComponentOption
    | LineSeriesOption
    | BarSeriesOption
    | PieSeriesOption
    | RadarSeriesOption
  >
}

export const Charts = ({ options, ...props }: ChartLineProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<ECharts>(null)

  // Init echarts instance
  useEffect(() => {
    if (!containerRef.current) {
      return
    };
    chartRef.current = init(containerRef.current)
    return () => {
      chartRef.current?.dispose()
    }
  }, [])

  // Resize echarts
  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    const dom = containerRef.current
    const ro = new ResizeObserver(() => {
      chartRef.current?.resize()
    })
    ro.observe(dom)

    return () => {
      ro.unobserve(dom)
    }
  }, [])

  // Update echarts options
  useEffect(() => {
    if (chartRef.current?.isDisposed()) {
      return
    }
    chartRef.current?.setOption(options)
  }, [options])

  return <div ref={containerRef} className="h-full w-full" {...props} />
}
