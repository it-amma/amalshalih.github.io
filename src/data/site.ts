export const SITE = {
	name: 'Yayasan Amal Shalih Insan Bantul',
	shortName: 'Yayasan ASIB',
	abbreviation: 'ASIB',
	tagline: 'Maslahat Bagi Umat',
	description:
		'Menjadi lembaga yang profesional dan berkarakter serta maslahat bagi umat.',
	url: 'https://amalshalih.id',
	founded: '2020',
	foundedDate: '27 Maret 2020',
	legal: {
		sk: 'AHU-0005855.AH.01.04.2020',
		nib: '1806230002006',
		npwp: '94.765.798.7-543.000',
		kbli: '85495 — Pendidikan Bimbingan Belajar',
	},
};

interface ContactEmails {
	info: string;
	donasi: string;
	admin: string;
	humas: string;
	gmail: string;
}

interface ContactAddress {
	street: string;
	village: string;
	district: string;
	city: string;
	province: string;
	postalCode: string;
	full: string;
	mapsUrl: string;
}

interface Contact {
	address: ContactAddress;
	phone: string;
	phoneUrl: string;
	whatsapp: string;
	email: string;
	emails: ContactEmails;
	hours: {
		weekdays: string;
		saturday: string;
		sunday: string;
	};
}

export const CONTACT: Contact = {
	address: {
		street: 'Juron',
		village: 'Pendowoharjo',
		district: 'Sewon',
		city: 'Bantul',
		province: 'Daerah Istimewa Yogyakarta',
		postalCode: '55185',
		full: 'Juron, Pendowoharjo, Sewon, Bantul, DIY 55185',
		mapsUrl: 'https://maps.google.com/?q=Yayasan+Amal+Shalih+Insan+Bantul',
	},
	phone: '0821-3800-7102',
	phoneUrl: 'tel:082138007102',
	whatsapp: 'https://wa.me/6282138007102',
	email: 'info@amalshalih.or.id',
	emails: {
		info: 'info@amalshalih.or.id',
		donasi: 'donasi@amalshalih.or.id',
		admin: 'admin@amalshalih.or.id',
		humas: 'humas@amalshalih.or.id',
		gmail: 'amalshalih.insanbantul@gmail.com',
	},
	hours: {
		weekdays: '08.00–16.00',
		saturday: '08.00–12.00',
		sunday: 'Tutup',
	},
};

export const BANKS = [
	{
		name: 'BSI',
		fullName: 'Bank Syariah Indonesia',
		accountNumber: '9515769570',
		accountName: 'Amal Shalih Insan Bantul',
	},
	{
		name: 'BRI',
		fullName: 'Bank Rakyat Indonesia',
		accountNumber: '023601001504565',
		accountName: 'Yayasan Amal Shalih Insan Bantul',
	},
	{
		name: 'Mandiri',
		fullName: 'Bank Mandiri',
		accountNumber: '1370023221274',
		accountName: 'Yayasan Amal Shalih Insan Bantul',
	},
	{
		name: 'BNI',
		fullName: 'Bank Negara Indonesia',
		accountNumber: '1822474588',
		accountName: 'Amal Shalih Insan Bantul',
	},
	{
		name: 'BCA',
		fullName: 'Bank Central Asia',
		accountNumber: '7317108000',
		accountName: 'Yayasan Amal Shalih Insan Bantul',
	},
];

export const SOCIAL = {
	facebook: {
		label: 'Facebook',
		url: 'https://facebook.com/amalshalihinsanbantul',
		ariaLabel: 'Facebook',
	},
	instagram: {
		label: 'Instagram',
		url: 'https://instagram.com/amalshalihinsan',
		ariaLabel: 'Instagram',
	},
	tiktok: {
		label: 'TikTok',
		url: 'https://tiktok.com/@yayasan.amalshalihinsan',
		ariaLabel: 'TikTok',
	},
	youtube: {
		label: 'YouTube',
		url: 'https://youtube.com/@amalshalihinsanbantul9997',
		ariaLabel: 'YouTube',
	},
	linktree: {
		label: 'Linktree',
		url: 'https://linktr.ee/amalshalihinsan',
	},
};

export const STATS = [
	{ number: '2020', label: 'Berdiri Sejak' },
	{ number: '110+', label: 'Penerima Manfaat Bulanan' },
	{ number: '7', label: 'Unit Program' },
	{ number: '500+', label: 'Paket Sembako Disalurkan' },
];

export const DONATION = {
	banks: BANKS,
	qrisImage: '/qris.webp',
	linktree: SOCIAL.linktree,
};
