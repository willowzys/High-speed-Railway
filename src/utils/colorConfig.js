// 统一的颜色配置文件，用于保持所有图表颜色一致

// 车型系列颜色映射
export const seriesColors = {
  'CRH1系': '#5470C6',
  'CRH2系': '#91CC75',
  'CRH3系': '#FAC858',
  'CRH5系': '#EE6666',
  'CRH6系': '#73C0DE',
  'CRH380系': '#8470FF',
  'CR300系': '#3BA272',
  'CR400系': '#FC8452',
  'CR450系': '#9A60B4',
  '其他': '#909366'
}

// 技术来源颜色映射
export const techColors = {
  'Regina/Zefiro平台': '#5470C6',  // 与CRH1系相同
  'Zefiro 380平台': '#91CC75',     // 与CRH2系相同
  'E2-1000平台': '#EE6666',        // 与CRH5系相同
  '自主升级版': '#FAC858',         // 与CRH3系相同
  'Velaro平台': '#73C0DE',         // 与CRH6系相同
  'Velaro+新干线技术融合': '#3BA272', // 与CR300系相同
  'Pendolino平台': '#FC8452',      // 与CR400系相同
  '技术消化吸收': '#9A60B4',       // 与CR450系相同
  'CRH380平台': '#8470FF',         // 与CRH380系相同
  '动力集中式': '#EA7CCC',
  '城际专用平台': '#FF9F7F',
  '试验型超高速': '#BDB76B'
}

// 获取车型系列的颜色
export function getSeriesColor(seriesName) {
  return seriesColors[seriesName] || seriesColors['其他']
}

// 获取技术来源的颜色
export function getTechColor(techSource) {
  return techColors[techSource] || '#ccc'
}

// 根据节点名称判断所属系列
export function getNodeSeries(name) {
  if (!name) return null
  
  if (name.includes('CRH1') || name.startsWith('CRH1')) return 'CRH1系'
  if (name.includes('CRH2') || name.startsWith('CRH2')) return 'CRH2系'
  if (name.includes('CRH3') || name.startsWith('CRH3')) return 'CRH3系'
  if (name.includes('CRH380') || name.startsWith('CRH380')) return 'CRH380系'
  if (name.includes('CRH5') || name.startsWith('CRH5')) return 'CRH5系'
  if (name.includes('CRH6') || name.startsWith('CRH6')) return 'CRH6系'
  if (name.includes('CR300') || name.startsWith('CR300')) return 'CR300系'
  if (name.includes('CR400') || name.startsWith('CR400')) return 'CR400系'
  if (name.includes('CR450') || name.startsWith('CR450')) return 'CR450系'
  
  return '其他'
}
