export {
  AccessToken,
  ArchiveAddByUtokenData,
  ArchiveListData,
  ArchiveListItem,
  ArchiveListPage,
  ArchiveStatus,
  ArchiveTypeChild,
  ArchiveTypeItem,
  ArcIncStatData,
  ArcStatData,
  CommonResponse,
  DeleteVideoData,
  etagData,
  GrantScopes,
  UserStatData,
  VideoUTypes,
} from '../common/open-platform.types'

export interface AddArchiveData {
  title: string // 标题
  cover?: string // 封面url
  tid: number // 分区ID，由获取分区信息接口得到
  no_reprint?: 0 | 1 // 是否允许转载 0-允许，1-不允许。默认0
  desc?: string // 描述
  tag: string // 标签, 多个标签用英文逗号分隔，总长度小于200
  copyright: 1 | 2 // 1-原创，2-转载(转载时source必填)
  source?: string // 如果copyright为转载，则此字段表示转载来源
  topic_id?: number // 参加的话题ID，默认情况下不填写，需要填写和运营联系
}

export interface BilibiliUser {
  face: string // 'https://i0.hdslb.com/bfs/face/43d971688595deed3b3c27b61225c0fe67d3076b.jpg';
  name: string // 'user_80800215578';
  openid: string // 'fc9899b46ff443cea38190d355d49f3a';
}

export interface videoInitialData {
  upload_token: string
}
