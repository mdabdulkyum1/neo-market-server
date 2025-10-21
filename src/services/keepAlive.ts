export function startKeepAlive(): void {
  const url = 'https://neo-market-server.onrender.com/api/v1/health'; 

  console.log('🟢 KeepAlive service started...');

  setInterval(async () => {
    try {
      const res = await fetch(url);
      console.log(
        `✅ Self-ping success: ${res.status} at ${new Date().toISOString()}`
      );
    } catch (err) {
      if (err instanceof Error) {
        console.error('❌ Self-ping failed:', err.message);
      } else {
        console.error('❌ Self-ping failed: Unknown error');
      }
    }
  }, 7 * 60 * 1000); 
}
