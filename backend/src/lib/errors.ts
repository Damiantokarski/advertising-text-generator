export class HttpError extends Error {
	status: number;
	code?: string;
	field?: string;
	constructor(message: string, status = 400, code?: string, field?: string) {
		super(message);
		this.status = status;
		this.code = code;
		this.field = field;
	}
}
