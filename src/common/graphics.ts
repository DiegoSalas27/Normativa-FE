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
    colors : ['#48b337', '#f5a700', '#f50000'],
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

export const configureGaugeOptions = (
  series: any[],
) => {
  return {
    series,
    chart: {
      type: 'radialBar',
      offsetY: -20,
      sparkline: {
        enabled: true
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: "#e7e7e7",
          strokeWidth: '97%',
          margin: 5, // margin is in pixels
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            color: '#999',
            opacity: 1,
            blur: 2
          }
        },
        dataLabels: {
          name: {
            show: false
          },
          value: {
            offsetY: -2,
            fontSize: '22px'
          }
        }
      }
    },
    grid: {
      padding: {
        top: -10
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        shadeIntensity: 0.4,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 53, 91]
      },
    },
    labels: ['Porcentaje de cumplimiento'],
  };
};

export const configureAreaxdOptions =(
  series:any[],

  ) => {
    console.log(series)
    return {
      series: series,
      
      chart: {
        type: 'area',
        height: 350
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      
      title: {
        text: 'Area with Negative Values',
        align: 'left',
        style: {
          fontSize: '14px'
        }
      },
      xaxis: {
        type: 'datetime',
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        tickAmount: 4,
        floating: false,
      
        labels: {
          style: {
            colors: '#8e8da4',
          },
          offsetY: -7,
          offsetX: 0,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false
        }
      },
      fill: {
        opacity: 0.5
      },
      tooltip: {
        x: {
          format: "yyyy",
        },
        fixed: {
          enabled: false,
          position: 'topRight'
        }
      },
      grid: {
        yaxis: {
          lines: {
            offsetX: -30
          }
        },
        padding: {
          left: 20
        }
      }
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

export const configureBarListOptions = (
  series:any[],
  XAxisPrueba: string[] | number[],
  )=> {
    return{
      series: [{
        data: series
      }],
      chart: {
        type:'bar',
        height: 350
      },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: true,
          }
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          categories:  XAxisPrueba,
        },
    };
  };
      
 


export const configureGaugeOptions2 = (
  series: any[],
) => {
  return {
    series,
    chart: {
      type: 'radialBar',
      offsetY: -20,
      sparkline: {
        enabled: true
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: "#e7e7e7",
          strokeWidth: '97%',
          margin: 5, // margin is in pixels
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            color: '#999',
            opacity: 1,
            blur: 2
          }
        },
        dataLabels: {
          name: {
            show: false
          },
          value: {
            offsetY: -2,
            fontSize: '22px'
          }
        }
      }
    },
    grid: {
      padding: {
        top: -10
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        shadeIntensity: 0.4,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 53, 91]
      },
    },
    labels: ['Porcentaje de cumplimiento'],
  };
};


export const configurePieChartOptions2 = (
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

export const configureLineChartOptions = (
  series: any[],
) => {
  return {
    series,
    chart: {
      height: 350,
      type: 'line',
      dropShadow: {
        enabled: true,
        color: '#000',
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2
      },
      toolbar: {
        show: false
      }
    },
    colors: ['#77B6EA', '#545454'],
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: 'smooth'
    },
    grid: {
      borderColor: '#e7e7e7',
      row: {
        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5
      },
    },
    markers: {
      size: 1
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      title: {
        text: 'Month'
      }
    },
    yaxis: {
      title: {
        text: 'Temperature'
      },
      min: 5,
      max: 40
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      floating: true,
      offsetY: -25,
      offsetX: -5
    }
  };
};

export const configureAreaChartOptions =  (
  series:any[],
  name: string,
  XAxisLista: string[] | number[],
  )=> {
    return{
      series: [{
        data: series,name
      }],
      chart: {
        height: 300,
        type: 'area'
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
        xaxis: {
          type: 'datetime',
          categories:  XAxisLista,
        },
        tooltip: {
          x: {
            format: 'dd/MM/yy HH:mm'
          },
        },
    };
  };
      


export const configureTreeMapChartOptions = (
  series: any[],
) => {
  return {
    series,
    legend: {
      show: false
    },
    chart: {
      height: 350,
      type: 'treemap'
    },
    colors: [
      '#3B93A5',
      '#F7B844',
      '#ADD8C7',
      '#EC3C65',
      '#CDD7B6',
      '#C1F666',
      '#D43F97',
      '#1E5D8C',
      '#421243',
      '#7F94B0',
      '#EF6537',
      '#C0ADDB'
    ],
    plotOptions: {
      treemap: {
        distributed: true,
        enableShades: false
      }
    }
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
    legend: {
      show: false,
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
  xAxisCategories: string[] | number[],
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
      // labels: {
      //   formatter: function (val: any) {
      //     return val + "K"
      //   }
      // }
    },
    yaxis: {
      title: {
        text: undefined
      },
    },
    tooltip: {
      // y: {
      //   formatter: function (val: any) {
      //     return val + "K"
      //   }
      // }
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