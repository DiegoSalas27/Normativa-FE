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

export const configureSemiDonutOptions = (
  series: any[],
  width: any,
) => {
  return {
    series,
    chart: {
      type: 'donut',
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 90,
        offsetY: 10
      }
    },
    grid: {
      padding: {
        bottom: -80
      }
    },
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
  }
}

export const configureStackBarChartOptions = (
  series: any[],
  height: number,
  xAxisCategories: number[],
) => {
  return {
    series,
    chart: {
      type: 'bar',
      height: height,
      stacked: true,
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    stroke: {
      width: 1,
      colors: ['#fff']
    },
    // title: {
    //   text: 'Fiction Books Sales'
    // },
    xaxis: {
      categories: xAxisCategories,
      labels: {
        formatter: function (val: any) {
          return val + "K"
        }
      }
    },
    yaxis: {
      title: {
        text: undefined
      },
    },
    tooltip: {
      y: {
        formatter: function (val: any) {
          return val + "K"
        }
      }
    },
    fill: {
      opacity: 1
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      offsetX: 40
    }
  }
}