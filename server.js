const fs = require('fs');
const path = require('path');
const http = require('http');
const { exec } = require('child_process');

// メディアファイルの拡張子
const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'];
const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm'];
const audioExtensions = ['mp3', 'wav', 'ogg', 'flac', 'm4a'];

// ディレクトリをスキャンする関数
function scanDirectory(dirPath, baseDir = null, depth = 0, maxDepth = 3) {
    if (depth > maxDepth) return [];
    
    if (!baseDir) baseDir = dirPath;
    
    const result = {
        files: [],
        folders: []
    };
    
    try {
        const items = fs.readdirSync(dirPath);
        
        items.forEach(item => {
            // 隠しファイルやシステムファイルをスキップ
            if (item.startsWith('.') || item === 'node_modules') return;
            
            const fullPath = path.join(dirPath, item);
            const relativePath = path.relative(baseDir, fullPath);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                const subItems = scanDirectory(fullPath, baseDir, depth + 1, maxDepth);
                result.folders.push({
                    name: item,
                    path: relativePath,
                    items: subItems
                });
            } else if (stat.isFile()) {
                const ext = path.extname(item).toLowerCase().slice(1);
                let type = 'other';
                
                if (imageExtensions.includes(ext)) type = 'image';
                else if (videoExtensions.includes(ext)) type = 'video';
                else if (audioExtensions.includes(ext)) type = 'audio';
                
                if (type !== 'other') {
                    result.files.push({
                        name: item,
                        path: relativePath,
                        type: type,
                        size: stat.size,
                        modified: stat.mtime
                    });
                }
            }
        });
    } catch (err) {
        console.error('Error scanning directory:', dirPath, err);
    }
    
    return result;
}

// HTTPサーバーの作成
const server = http.createServer((req, res) => {
    // CORS設定
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // OPTIONS リクエストへの対応（CORS preflight）
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    res.setHeader('Content-Type', 'application/json');
    
    if (req.url === '/api/scan' && req.method === 'GET') {
        // 現在のディレクトリをスキャン
        const currentDir = process.cwd();
        const mediaFiles = scanDirectory(currentDir);
        
        res.writeHead(200);
        res.end(JSON.stringify({
            baseDir: currentDir,
            data: mediaFiles
        }));
    } else if (req.url === '/api/open-file' && req.method === 'POST') {
        // ファイルを開く
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const { path: filePath } = JSON.parse(body);
                const fullPath = path.join(process.cwd(), filePath);
                
                // macOSの場合
                if (process.platform === 'darwin') {
                    exec(`open "${fullPath}"`, (error) => {
                        if (error) {
                            console.error('Error opening file:', error);
                            res.writeHead(500);
                            res.end(JSON.stringify({ error: 'Failed to open file' }));
                        } else {
                            res.writeHead(200);
                            res.end(JSON.stringify({ success: true }));
                        }
                    });
                }
                // Windowsの場合
                else if (process.platform === 'win32') {
                    exec(`start "" "${fullPath}"`, (error) => {
                        if (error) {
                            console.error('Error opening file:', error);
                            res.writeHead(500);
                            res.end(JSON.stringify({ error: 'Failed to open file' }));
                        } else {
                            res.writeHead(200);
                            res.end(JSON.stringify({ success: true }));
                        }
                    });
                }
                // Linuxの場合
                else {
                    exec(`xdg-open "${fullPath}"`, (error) => {
                        if (error) {
                            console.error('Error opening file:', error);
                            res.writeHead(500);
                            res.end(JSON.stringify({ error: 'Failed to open file' }));
                        } else {
                            res.writeHead(200);
                            res.end(JSON.stringify({ success: true }));
                        }
                    });
                }
            } catch (err) {
                console.error('Error parsing request:', err);
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Invalid request' }));
            }
        });
    } else if (req.url === '/api/open-folder' && req.method === 'POST') {
        // フォルダを開く
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const { path: folderPath } = JSON.parse(body);
                const fullPath = path.join(process.cwd(), folderPath);
                
                // macOSの場合
                if (process.platform === 'darwin') {
                    exec(`open "${fullPath}"`, (error) => {
                        if (error) {
                            console.error('Error opening folder:', error);
                            res.writeHead(500);
                            res.end(JSON.stringify({ error: 'Failed to open folder' }));
                        } else {
                            res.writeHead(200);
                            res.end(JSON.stringify({ success: true }));
                        }
                    });
                }
                // Windowsの場合
                else if (process.platform === 'win32') {
                    exec(`explorer "${fullPath}"`, (error) => {
                        if (error) {
                            console.error('Error opening folder:', error);
                            res.writeHead(500);
                            res.end(JSON.stringify({ error: 'Failed to open folder' }));
                        } else {
                            res.writeHead(200);
                            res.end(JSON.stringify({ success: true }));
                        }
                    });
                }
                // Linuxの場合
                else {
                    exec(`xdg-open "${fullPath}"`, (error) => {
                        if (error) {
                            console.error('Error opening folder:', error);
                            res.writeHead(500);
                            res.end(JSON.stringify({ error: 'Failed to open folder' }));
                        } else {
                            res.writeHead(200);
                            res.end(JSON.stringify({ success: true }));
                        }
                    });
                }
            } catch (err) {
                console.error('Error parsing request:', err);
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Invalid request' }));
            }
        });
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not found' }));
    }
});

const PORT = 3333;
server.listen(PORT, () => {
    console.log(`Media scanner server running at http://localhost:${PORT}`);
    console.log(`API endpoint: http://localhost:${PORT}/api/scan`);
});