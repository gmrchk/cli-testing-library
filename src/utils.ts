import { ChildProcessWithoutNullStreams } from 'child_process';

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
