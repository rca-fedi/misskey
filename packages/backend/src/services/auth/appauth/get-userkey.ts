// Fetch token from database
import { Apps, AuthSessions, AccessTokens, Users } from '@/models/index.js';

export const errors = { //呼び出し元でApiErrorつかって最終的にユーザー/ログへ流す（呼び出し元で発生したエラーを識別するためのコードだけを返す）
	noSuchApp: {
		code: 'NO_SUCH_APP',
	},

	noSuchSession: {
		code: 'NO_SUCH_SESSION',
	},

	pendingSession: {
		code: 'PENDING_SESSION',
	},
} as const;

export async function fetchBySecretAndToken(appSecret: string, token: string): Promise<any> { //appSecretとtokenからアクセストークンを取得するやつ
	// Lookup app
	const app = await Apps.findOneBy({
		secret: appSecret,
	});
	
	if (app == null) {
		throw new Error(errors.noSuchApp.code);
	}
	
	// Fetch token
	const session = await AuthSessions.findOneBy({
		token: token,
		appId: app.id,
	});
	
	if (session == null) {
		throw new Error(errors.noSuchSession.code);
	}
	
	if (session.userId == null) {
		throw new Error(errors.pendingSession.code);
	}
	
	// Lookup access token
	const accessToken = await AccessTokens.findOneByOrFail({
		appId: app.id,
		userId: session.userId,
	});

	return accessToken;
}

export async function fetchByToken(token: string): Promise<any> { //tokenからアクセストークンを取得するやつ
	
}
