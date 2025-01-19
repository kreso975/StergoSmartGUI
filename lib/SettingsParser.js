import { readFileSync } from 'fs';

class SettingsParser {
    constructor(filePath) {
        this.filePath = filePath;
        this.settings = this.parseSettings();
    }

    parseSettings() {
        const settingsContent = readFileSync(this.filePath, 'utf-8');
        const settings = {};

        settingsContent.split('\n').forEach(line => {
            const [key, value] = line.split('=').map(item => item.trim());
            if (key && value) {
                if (value.startsWith('[') && value.endsWith(']')) {
                    // Parse array-like structure
                    try {
                        settings[key] = JSON.parse(value);
                    } catch (error) {
                        settings[key] = value.slice(1, -1).split(',').map(item => item.trim());
                    }
                } else if (value.startsWith('{') && value.endsWith('}')) {
                    // Parse object-like structure
                    settings[key] = JSON.parse(value);
                } else if (value === 'true' || value === 'false') {
                    settings[key] = value === 'true';
                } else if (!isNaN(value)) {
                    settings[key] = Number(value);
                } else {
                    settings[key] = value.replace(/"/g, '');
                }
            }
        });

        return settings;
    }

    getSettings() {
        return this.settings;
    }
}

export default SettingsParser;
