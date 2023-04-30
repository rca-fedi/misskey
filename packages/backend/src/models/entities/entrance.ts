import { Entity, PrimaryColumn, Index, Column } from 'typeorm';
import { id } from '@/models/id.js';

// TODO: コメントはあとで日本語に直す
@Entity()
export class Entrance {
	@PrimaryColumn(id())
	public id: string;

	@Column('varchar',{
		length: 64,
		comment: 'プリセット名',
	})
	public name: string;
	
	@Column('varchar',{
		length: 256,
		comment: '背景画像URL',
	})
	public backgroundUrl: string;

	@Column('varchar',{
		length: 32,
		comment: '登録ウィンドウマージン右',
	})
	public registerWindowMarginRight: string;

	@Column('varchar',{
		length: 32,
		comment: '登録ウィンドウマージン下',
	})
	public registerWindowMarginBottom: string;

	@Column('varchar',{
		length: 32,
		comment: '登録ウィンドウマージン左',
	})
	public registerWindowMarginLeft: string;

	@Column('varchar',{
		default: 0,
		comment: '登録ウィンドウマージン上',
	})
	public registerWindowMarginTop: string;

	@Column('integer',{
		default: 1,
		comment: '登録ウィンドウタイプ',
	})
	public registerWindowType: number;
}
