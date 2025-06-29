import { spawn } from 'child_process';

function executeCommand(command: string, args: string[] = []): void {
   const process = spawn(command, args, {
      stdio: 'inherit', // This will show output in real-time
      shell: true
   });

   process.on('close', (code) => {
      console.log(`Command "${command} ${args.join(' ')}" finished with code ${code}`);
   });

   process.on('error', (error) => {
      console.error(error);
   });
}

async function executeCommands() {
   try {
      console.log('Starting AI service...');
      executeCommand('npm', ['run', 'service:ai']);

      console.log('Starting Slack service...');
      executeCommand('npm', ['run', 'service:slack']);

      console.log('All commands completed!');
   } catch (error) {
      console.error('Error executing commands:', error);
      process.exit(1);
   }
}

executeCommands();
