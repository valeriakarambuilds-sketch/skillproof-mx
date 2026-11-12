import { spawn } from 'node:child_process';
// The managed preview daemon uses Vite-style flags; translate them for Next.
const args = process.argv.slice(2).flatMap(arg => arg === '--strictPort' ? [] : [arg === '--host' ? '--hostname' : arg]);
const child = spawn(process.execPath,['node_modules/next/dist/bin/next','dev',...args],{stdio:'inherit'});
child.on('exit',code=>process.exit(code??1));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>child.kill(signal));
