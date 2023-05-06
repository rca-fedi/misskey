/**
 * ユーザーが設定する必要のある情報
 */
export type Source = {
	repository_url?: string;
	feedback_url?: string;
	main: {
		url: string;
		port: number;
	};
	enableV12c: boolean;
	v12c: {
		url: string;
		port: number;
	};
	disableHsts?: boolean;
	db: {
		host: string;
		port: number;
		db: string;
		user: string;
		pass: string;
		disableCache?: boolean;
		extra?: { [x: string]: string };
	};
	redis: {
		host: string;
		port: number;
		family?: number;
		pass: string;
		db?: number;
		prefix?: string;
	};
	elasticsearch: {
		host: string;
		port: number;
		ssl?: boolean;
		user?: string;
		pass?: string;
		index?: string;
	};

	proxy?: string;
	proxySmtp?: string;
	proxyBypassHosts?: string[];

	allowedPrivateNetworks?: string[];

	maxFileSize?: number;

	accesslog?: string;

	clusterLimit?: number;

	id: string;

	outgoingAddressFamily?: 'ipv4' | 'ipv6' | 'dual';

	deliverJobConcurrency?: number;
	inboxJobConcurrency?: number;
	deliverJobPerSec?: number;
	inboxJobPerSec?: number;
	deliverJobMaxAttempts?: number;
	inboxJobMaxAttempts?: number;

	syslog: {
		host: string;
		port: number;
	};

	mediaProxy?: string;
	proxyRemoteFiles?: boolean;

	signToActivityPubGet?: boolean;

	configTemplateVersion: string;
};

/**
 * Misskeyが自動的に(ユーザーが設定した情報から推論して)設定する情報
 */
export type Mixin = {
	softwareName: string;
	version: string;
	based_version: string;
	userAgent: string;
	clientEntry: string;
	// main
	main_host: string;
	main_hostname: string;
	main_scheme: string;
	main_wsScheme: string;
	main_apiUrl: string;
	main_wsUrl: string;
	main_authUrl: string;
	main_driveUrl: string;

	// v12 compatible
	v12c_host: string;
	v12c_hostname: string;
	v12c_scheme: string;
	v12c_wsScheme: string;
	v12c_apiUrl: string;
	v12c_wsUrl: string;
	v12c_authUrl: string;
	v12c_driveUrl: string;
};

export type Config = Source & Mixin;
