import { AbuseUserReport } from '@/models/entities/AbuseUserReport.js';
import { AccessToken } from '@/models/entities/AccessToken.js';
import { Ad } from '@/models/entities/Ad.js';
import { Announcement } from '@/models/entities/Announcement.js';
import { AnnouncementRead } from '@/models/entities/AnnouncementRead.js';
import { Antenna } from '@/models/entities/Antenna.js';
import { AntennaNote } from '@/models/entities/AntennaNote.js';
import { App } from '@/models/entities/App.js';
import { AttestationChallenge } from '@/models/entities/AttestationChallenge.js';
import { AuthSession } from '@/models/entities/AuthSession.js';
import { Blocking } from '@/models/entities/Blocking.js';
import { ChannelFollowing } from '@/models/entities/ChannelFollowing.js';
import { ChannelNotePining } from '@/models/entities/ChannelNotePining.js';
import { Clip } from '@/models/entities/Clip.js';
import { ClipNote } from '@/models/entities/ClipNote.js';
import { DriveFile } from '@/models/entities/DriveFile.js';
import { DriveFolder } from '@/models/entities/DriveFolder.js';
import { Emoji } from '@/models/entities/Emoji.js';
import { Following } from '@/models/entities/Following.js';
import { FollowRequest } from '@/models/entities/FollowRequest.js';
import { GalleryLike } from '@/models/entities/GalleryLike.js';
import { GalleryPost } from '@/models/entities/GalleryPost.js';
import { Hashtag } from '@/models/entities/Hashtag.js';
import { Instance } from '@/models/entities/Instance.js';
import { MessagingMessage } from '@/models/entities/MessagingMessage.js';
import { Meta } from '@/models/entities/Meta.js';
import { ModerationLog } from '@/models/entities/ModerationLog.js';
import { MutedNote } from '@/models/entities/MutedNote.js';
import { Muting } from '@/models/entities/Muting.js';
import { Note } from '@/models/entities/Note.js';
import { NoteFavorite } from '@/models/entities/NoteFavorite.js';
import { NoteReaction } from '@/models/entities/NoteReaction.js';
import { NoteThreadMuting } from '@/models/entities/NoteThreadMuting.js';
import { NoteUnread } from '@/models/entities/NoteUnread.js';
import { Notification } from '@/models/entities/Notification.js';
import { Page } from '@/models/entities/Page.js';
import { PageLike } from '@/models/entities/PageLike.js';
import { PasswordResetRequest } from '@/models/entities/PasswordResetRequest.js';
import { Poll } from '@/models/entities/Poll.js';
import { PollVote } from '@/models/entities/PollVote.js';
import { PromoNote } from '@/models/entities/PromoNote.js';
import { PromoRead } from '@/models/entities/PromoRead.js';
import { RegistrationTicket } from '@/models/entities/RegistrationTicket.js';
import { RegistryItem } from '@/models/entities/RegistryItem.js';
import { Relay } from '@/models/entities/Relay.js';
import { Signin } from '@/models/entities/Signin.js';
import { SwSubscription } from '@/models/entities/SwSubscription.js';
import { UsedUsername } from '@/models/entities/UsedUsername.js';
import { User } from '@/models/entities/User.js';
import { UserGroup } from '@/models/entities/UserGroup.js';
import { UserGroupInvitation } from '@/models/entities/UserGroupInvitation.js';
import { UserGroupJoining } from '@/models/entities/UserGroupJoining.js';
import { UserIp } from '@/models/entities/UserIp.js';
import { UserKeypair } from '@/models/entities/UserKeypair.js';
import { UserList } from '@/models/entities/UserList.js';
import { UserListJoining } from '@/models/entities/UserListJoining.js';
import { UserNotePining } from '@/models/entities/UserNotePining.js';
import { UserPending } from '@/models/entities/UserPending.js';
import { UserProfile } from '@/models/entities/UserProfile.js';
import { UserPublickey } from '@/models/entities/UserPublickey.js';
import { UserSecurityKey } from '@/models/entities/UserSecurityKey.js';
import { Webhook } from '@/models/entities/Webhook.js';
import { Channel } from '@/models/entities/Channel.js';
import { RetentionAggregation } from '@/models/entities/RetentionAggregation.js';
import type { Repository } from 'typeorm';

import { Announcement } from './entities/announcement.js';
import { AnnouncementRead } from './entities/announcement-read.js';
import { Instance } from './entities/instance.js';
import { Poll } from './entities/poll.js';
import { PollVote } from './entities/poll-vote.js';
import { Meta } from './entities/meta.js';
import { SwSubscription } from './entities/sw-subscription.js';
import { NoteWatching } from './entities/note-watching.js';
import { NoteThreadMuting } from './entities/note-thread-muting.js';
import { NoteUnread } from './entities/note-unread.js';
import { RegistrationTicket } from './entities/registration-tickets.js';
import { UserRepository } from './repositories/user.js';
import { NoteRepository } from './repositories/note.js';
import { DriveFileRepository } from './repositories/drive-file.js';
import { DriveFolderRepository } from './repositories/drive-folder.js';
import { AccessToken } from './entities/access-token.js';
import { UserNotePining } from './entities/user-note-pining.js';
import { SigninRepository } from './repositories/signin.js';
import { MessagingMessageRepository } from './repositories/messaging-message.js';
import { UserListRepository } from './repositories/user-list.js';
import { UserListJoining } from './entities/user-list-joining.js';
import { UserGroupRepository } from './repositories/user-group.js';
import { UserGroupJoining } from './entities/user-group-joining.js';
import { UserGroupInvitationRepository } from './repositories/user-group-invitation.js';
import { FollowRequestRepository } from './repositories/follow-request.js';
import { MutingRepository } from './repositories/muting.js';
import { BlockingRepository } from './repositories/blocking.js';
import { NoteReactionRepository } from './repositories/note-reaction.js';
import { NotificationRepository } from './repositories/notification.js';
import { NoteFavoriteRepository } from './repositories/note-favorite.js';
import { UserPublickey } from './entities/user-publickey.js';
import { UserKeypair } from './entities/user-keypair.js';
import { AppRepository } from './repositories/app.js';
import { FollowingRepository } from './repositories/following.js';
import { AbuseUserReportRepository } from './repositories/abuse-user-report.js';
import { AuthSessionRepository } from './repositories/auth-session.js';
import { UserProfile } from './entities/user-profile.js';
import { AttestationChallenge } from './entities/attestation-challenge.js';
import { UserSecurityKey } from './entities/user-security-key.js';
import { HashtagRepository } from './repositories/hashtag.js';
import { PageRepository } from './repositories/page.js';
import { PageLikeRepository } from './repositories/page-like.js';
import { GalleryPostRepository } from './repositories/gallery-post.js';
import { GalleryLikeRepository } from './repositories/gallery-like.js';
import { ModerationLogRepository } from './repositories/moderation-logs.js';
import { UsedUsername } from './entities/used-username.js';
import { ClipRepository } from './repositories/clip.js';
import { ClipNote } from './entities/clip-note.js';
import { AntennaRepository } from './repositories/antenna.js';
import { AntennaNote } from './entities/antenna-note.js';
import { PromoNote } from './entities/promo-note.js';
import { PromoRead } from './entities/promo-read.js';
import { EmojiRepository } from './repositories/emoji.js';
import { RelayRepository } from './repositories/relay.js';
import { ChannelRepository } from './repositories/channel.js';
import { MutedNote } from './entities/muted-note.js';
import { ChannelFollowing } from './entities/channel-following.js';
import { ChannelNotePining } from './entities/channel-note-pining.js';
import { RegistryItem } from './entities/registry-item.js';
import { Ad } from './entities/ad.js';
import { PasswordResetRequest } from './entities/password-reset-request.js';
import { UserPending } from './entities/user-pending.js';
import { InstanceRepository } from './repositories/instance.js';
import { Webhook } from './entities/webhook.js';
import { UserIp } from './entities/user-ip.js';
import { Entrance } from './entities/entrance.js';
export {
	AbuseUserReport,
	AccessToken,
	Ad,
	Announcement,
	AnnouncementRead,
	Antenna,
	AntennaNote,
	App,
	AttestationChallenge,
	AuthSession,
	Blocking,
	ChannelFollowing,
	ChannelNotePining,
	Clip,
	ClipNote,
	DriveFile,
	DriveFolder,
	Emoji,
	Following,
	FollowRequest,
	GalleryLike,
	GalleryPost,
	Hashtag,
	Instance,
	MessagingMessage,
	Meta,
	ModerationLog,
	MutedNote,
	Muting,
	Note,
	NoteFavorite,
	NoteReaction,
	NoteThreadMuting,
	NoteUnread,
	Notification,
	Page,
	PageLike,
	PasswordResetRequest,
	Poll,
	PollVote,
	PromoNote,
	PromoRead,
	RegistrationTicket,
	RegistryItem,
	Relay,
	Signin,
	SwSubscription,
	UsedUsername,
	User,
	UserGroup,
	UserGroupInvitation,
	UserGroupJoining,
	UserIp,
	UserKeypair,
	UserList,
	UserListJoining,
	UserNotePining,
	UserPending,
	UserProfile,
	UserPublickey,
	UserSecurityKey,
	Webhook,
	Channel,
	RetentionAggregation,
	Flash,
	FlashLike,
};

export type AbuseUserReportsRepository = Repository<AbuseUserReport>;
export type AccessTokensRepository = Repository<AccessToken>;
export type AdsRepository = Repository<Ad>;
export type AnnouncementsRepository = Repository<Announcement>;
export type AnnouncementReadsRepository = Repository<AnnouncementRead>;
export type AntennasRepository = Repository<Antenna>;
export type AntennaNotesRepository = Repository<AntennaNote>;
export type AppsRepository = Repository<App>;
export type AttestationChallengesRepository = Repository<AttestationChallenge>;
export type AuthSessionsRepository = Repository<AuthSession>;
export type BlockingsRepository = Repository<Blocking>;
export type ChannelFollowingsRepository = Repository<ChannelFollowing>;
export type ChannelNotePiningsRepository = Repository<ChannelNotePining>;
export type ClipsRepository = Repository<Clip>;
export type ClipNotesRepository = Repository<ClipNote>;
export type DriveFilesRepository = Repository<DriveFile>;
export type DriveFoldersRepository = Repository<DriveFolder>;
export type EmojisRepository = Repository<Emoji>;
export type FollowingsRepository = Repository<Following>;
export type FollowRequestsRepository = Repository<FollowRequest>;
export type GalleryLikesRepository = Repository<GalleryLike>;
export type GalleryPostsRepository = Repository<GalleryPost>;
export type HashtagsRepository = Repository<Hashtag>;
export type InstancesRepository = Repository<Instance>;
export type MessagingMessagesRepository = Repository<MessagingMessage>;
export type MetasRepository = Repository<Meta>;
export type ModerationLogsRepository = Repository<ModerationLog>;
export type MutedNotesRepository = Repository<MutedNote>;
export type MutingsRepository = Repository<Muting>;
export type NotesRepository = Repository<Note>;
export type NoteFavoritesRepository = Repository<NoteFavorite>;
export type NoteReactionsRepository = Repository<NoteReaction>;
export type NoteThreadMutingsRepository = Repository<NoteThreadMuting>;
export type NoteUnreadsRepository = Repository<NoteUnread>;
export type NotificationsRepository = Repository<Notification>;
export type PagesRepository = Repository<Page>;
export type PageLikesRepository = Repository<PageLike>;
export type PasswordResetRequestsRepository = Repository<PasswordResetRequest>;
export type PollsRepository = Repository<Poll>;
export type PollVotesRepository = Repository<PollVote>;
export type PromoNotesRepository = Repository<PromoNote>;
export type PromoReadsRepository = Repository<PromoRead>;
export type RegistrationTicketsRepository = Repository<RegistrationTicket>;
export type RegistryItemsRepository = Repository<RegistryItem>;
export type RelaysRepository = Repository<Relay>;
export type SigninsRepository = Repository<Signin>;
export type SwSubscriptionsRepository = Repository<SwSubscription>;
export type UsedUsernamesRepository = Repository<UsedUsername>;
export type UsersRepository = Repository<User>;
export type UserGroupsRepository = Repository<UserGroup>;
export type UserGroupInvitationsRepository = Repository<UserGroupInvitation>;
export type UserGroupJoiningsRepository = Repository<UserGroupJoining>;
export type UserIpsRepository = Repository<UserIp>;
export type UserKeypairsRepository = Repository<UserKeypair>;
export type UserListsRepository = Repository<UserList>;
export type UserListJoiningsRepository = Repository<UserListJoining>;
export type UserNotePiningsRepository = Repository<UserNotePining>;
export type UserPendingsRepository = Repository<UserPending>;
export type UserProfilesRepository = Repository<UserProfile>;
export type UserPublickeysRepository = Repository<UserPublickey>;
export type UserSecurityKeysRepository = Repository<UserSecurityKey>;
export type WebhooksRepository = Repository<Webhook>;
export type ChannelsRepository = Repository<Channel>;
export type RetentionAggregationsRepository = Repository<RetentionAggregation>;
