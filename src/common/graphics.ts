export const configureBarChartOptions = (
  series: any[],
  height: number,
  xAxisType: string,
  xAxiscategories: string[],
  stacked?: boolean,
  horizontalPlot?: boolean,
  legendPosition?: "left" | "right" | "center",
  legendOffsetY?: number
) => {
  return {
    series,
    chart: {
      type: 'bar',
      height,
      stacked,
      toolbar: {
        show: true,
      },
      zoom: {
        enabled: true,
      },
    },
    plotOptions: {
      bar: {
        horizontal: horizontalPlot,
        borderRadius: 2,
      },
    },
    legend: {
      position: legendPosition,
      offsetY: legendOffsetY,
    },
    fill: {
      opacity: 1,
    },
    xaxis: {
      type: xAxisType,
      categories: xAxiscategories,
    },
  };
};

export const configurePieChartOptions = (
  series: any[],
  width: any,
  labels: string[],
) => {
  return {
    series,
    chart: {
      type: 'pie',
      width,
      toolbar: {
        show: true,
      },
      zoom: {
        enabled: true,
      },
    },
    labels,
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };
};
