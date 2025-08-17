declare global {
	interface Window {
		ym: (id: string, action: string, params?: any) => void;
		Ya: any;
	}
}

export {}; 