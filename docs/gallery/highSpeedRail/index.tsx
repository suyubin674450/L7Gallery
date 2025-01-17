import { LarkMap, PointLayer, Scale, Zoom, CustomControl } from '@antv/larkmap';
import type { LarkMapProps, PointLayerProps } from '@antv/larkmap';
import React, { useEffect, useState, useMemo } from 'react';
import MyComponent from './MyComponent';

interface IdataType {
  province: string;
  busStop: string;
  address: string;
  lng: string;
  lat: string;
  WGS84lng: string;
  WGS84lat: string;
}

export default () => {
  const [data, setData] = useState<IdataType[] | undefined>([]);

  const config: LarkMapProps = {
    mapType: 'GaodeV1',
    mapOptions: {
      style: 'light',
      zoom: 6,
      minZoom: 6,
      maxZoom: 9,
    },
    style: {
      height: 500,
    },
    logoPosition: 'bottomleft',
  };
  const pointLayerOptions: PointLayerProps = useMemo(() => {
    return {
      id: 'myPoitLayer',
      // autoFit: true, // 设置完数据后自动将点图层放大到视口范围位置
      // shape: {
      //   field: 'address',
      //   value: 'text', // 以文本形式展示
      // },
      /* 
        若是使用简单的圆点图层，建议使用 simple 代替 circle 以获得更好的性能，
        注意：circle 与 simple 样式有所不同
        文档参考：https://antv-l7.gitee.io/zh/docs/api/point_layer/pointlayer#shape
      */
      shape: 'circle',
      size: 5,
      color: {
        field: 'address',
        value: ['#f00', 'rgba(159,180,15,1)'],
      },
      state: {
        active: {
          color: 'pink', // 设置鼠标划过点的颜色
        },
      },
      style: {
        opacity: 0.7,
      },
      source: {
        data: data,
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      },
      blend: 'normal', // 图层元素混合效果 https://antv-l7.gitee.io/zh/docs/api/base#blend
    };
  }, [data]);

  useEffect(() => {
    fetch('https://gw.alipayobjects.com/os/bmw-prod/d5ec85b7-3ac6-4987-924a-3952d7e31bcb.json')
      .then((res) => res.json())
      .then((dataArr) => {
        setData(dataArr);
      });
  }, []);

  return (
    <LarkMap {...config}>
      <CustomControl position={'topleft'}>
        <h2>鼠标划过显示站点信息</h2>
      </CustomControl>
      <PointLayer {...pointLayerOptions} />
      {/* 比例尺控件 */}
      <Scale position={'bottomleft'} />
      {/* 缩放器控件 */}
      <Zoom position={'bottomright'} />
      <MyComponent />
    </LarkMap>
  );
};
