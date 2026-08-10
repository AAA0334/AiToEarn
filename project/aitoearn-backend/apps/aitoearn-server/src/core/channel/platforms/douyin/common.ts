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
} from '../../libs/common/open-platform.types'

export interface DouyinAuthInfo {
  state: string
  userId?: string
  accountId?: string
}

export enum WebhookEvent {
  VerifyWebhook = 'verify_webhook',
  PublishVideo = 'publish_video',
}
