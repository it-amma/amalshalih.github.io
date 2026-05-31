import { getFirebaseAdminToken } from '../src/lib/firebase/admin';

const RTDB_URL = process.env.FIREBASE_RTDB_URL || 'https://amalshalih-fd1bd-default-rtdb.firebaseio.com';

async function resetRTDB() {
	console.log('🔥 Resetting Firebase Realtime Database...');
	console.log(`URL: ${RTDB_URL}`);
	
	try {
		const token = await getFirebaseAdminToken();
		
		const response = await fetch(`${RTDB_URL}/.json?access_token=${token}`, {
			method: 'DELETE',
		});
		
		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`Failed to reset RTDB: ${response.status} ${errorText}`);
		}
		
		console.log('✅ RTDB reset successfully!');
		console.log('All data has been cleared.');
		
	} catch (error) {
		console.error('❌ Error resetting RTDB:', error);
		process.exit(1);
	}
}

resetRTDB();
