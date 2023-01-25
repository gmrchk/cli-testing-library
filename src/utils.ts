import {ChildProcessWithoutNullStreams} from 'child_process';

export const checkRunningProcess = (currentProcessRef: {
  current: ChildProcessWithoutNullStreams | null;
}): currentProcessRef is { current: ChildProcessWithoutNullStreams } => {
  if (!currentProcessRef.current) {
    throw new Error(
      'No process is running. Start it with `execute`, or the process has already finished.'
    );
  }

  return true;
};

const SPACES_REGEXP = / +/g;

export const parseCommand = (command: string): string[] => {
  const tokens: string[] = [];

  for (const token of command.trim().split(SPACES_REGEXP)) {
    // Allow spaces to be escaped by a backslash if not meant as a delimiter
    const previousToken = tokens[tokens.length - 1];
    if (previousToken && previousToken.endsWith('\\')) {
      // Merge previous token with current one
      tokens[tokens.length - 1] = `${previousToken.slice(0, -1)} ${token}`;
    } else {
      tokens.push(token);
    }
  }

  return tokens;
};
