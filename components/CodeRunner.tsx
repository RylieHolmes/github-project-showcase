import React, { useState, useEffect, useRef } from 'react';
import { fetchRepoContents, fetchRawFile } from '../services/githubService';
import type { GithubRepo, GithubFile } from '../types';
import LoadingSpinner from './LoadingSpinner';
import CloseIcon from './icons/CloseIcon';

declare global {
  interface Window {
    loadPyodide: (options?: { indexURL: string }) => Promise<any>;
  }
}

interface CodeRunnerProps {
    repo: GithubRepo;
    username: string;
    onClose: () => void;
}

const CodeRunner: React.FC<CodeRunnerProps> = ({ repo, username, onClose }) => {
    const [pyodide, setPyodide] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRunning, setIsRunning] = useState(false);
    const [code, setCode] = useState<string>('');
    const [output, setOutput] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const outputRef = useRef<HTMLPreElement>(null);

    useEffect(() => {
        const setupPyodide = async () => {
            try {
                const pyodideInstance = await window.loadPyodide({
                    indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/'
                });
                // Capture stdout and stderr
                pyodideInstance.setStdout({ batched: (str: string) => setOutput(prev => prev + str + '\n') });
                pyodideInstance.setStderr({ batched: (str: string) => setOutput(prev => prev + str + '\n') });
                setPyodide(pyodideInstance);
            } catch (err) {
                console.error('Failed to load Pyodide:', err);
                setError('Failed to initialize the Python environment.');
            }
        };
        setupPyodide();
    }, []);

    useEffect(() => {
        if (!pyodide) return;

        const findAndLoadCode = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const contents = await fetchRepoContents(username, repo.name);
                // Look for main.py, then the first .py file
                let pyFile = contents.find(file => file.name.toLowerCase() === 'main.py' && file.type === 'file');
                if (!pyFile) {
                    pyFile = contents.find(file => file.name.endsWith('.py') && file.type === 'file');
                }

                if (pyFile) {
                    if (pyFile.content) {
                        // Content is available directly (for files < 1MB)
                        const fileContent = atob(pyFile.content);
                        setCode(fileContent);
                    } else if (pyFile.download_url) {
                        // Content needs to be fetched from download_url (for files > 1MB)
                        const fileContent = await fetchRawFile(pyFile.download_url);
                        setCode(fileContent);
                    } else {
                         setError('Python file found, but its content is not accessible.');
                    }
                } else {
                    setError('No Python file (.py) found in the root of this repository.');
                }
            } catch (err) {
                console.error('Failed to load repo contents:', err);
                setError('Could not load the project files.');
            } finally {
                setIsLoading(false);
            }
        };
        findAndLoadCode();
    }, [pyodide, repo.name, username]);

     useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [output]);

    const runCode = async () => {
        if (!pyodide || !code) return;
        setIsRunning(true);
        setOutput('');
        try {
            await pyodide.runPythonAsync(code);
        } catch (err: any) {
            setOutput(prev => prev + err.toString() + '\n');
        } finally {
            setIsRunning(false);
        }
    };

    const renderContent = () => {
        if (!pyodide || isLoading) {
            return (
                <div className="flex flex-col items-center justify-center p-8">
                    <LoadingSpinner />
                    <p className="mt-4 text-gray-300">Preparing Python environment...</p>
                </div>
            )
        }
        if (error) {
            return <p className="p-4 text-center text-red-400">{error}</p>;
        }
        if (!code) {
             return <p className="p-4 text-center text-yellow-400">Could not find a Python file to run.</p>;
        }

        return (
            <>
                <div className="bg-gray-900 p-4 rounded-t-md border-b-2 border-purple-800">
                    <h4 className="text-lg font-semibold text-gray-200">Code</h4>
                </div>
                <pre className="p-4 bg-black/30 max-h-60 overflow-auto text-sm">
                    <code>{code}</code>
                </pre>
                <div className="bg-gray-900 p-2 flex justify-between items-center">
                    <h4 className="text-lg font-semibold text-gray-200 px-2">Output</h4>
                    <button
                        onClick={runCode}
                        disabled={isRunning}
                        className="bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                    >
                        {isRunning ? 'Running...' : 'Run Code'}
                    </button>
                </div>
                <pre ref={outputRef} className="p-4 bg-black/50 rounded-b-md h-48 overflow-auto text-sm whitespace-pre-wrap font-mono">
                    {output || <span className="text-gray-500">Output will appear here...</span>}
                </pre>
            </>
        )
    };

    return (
        <div className="my-6 border border-purple-700 rounded-lg shadow-xl relative">
            <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors z-10" aria-label="Close code runner">
                <CloseIcon className="w-8 h-8 p-1 bg-gray-900/50 rounded-full" />
            </button>
            {renderContent()}
        </div>
    );
};

export default CodeRunner;