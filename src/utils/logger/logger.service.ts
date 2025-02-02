import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';

@Injectable()
export class LoggerService implements NestLoggerService {
    private getTimestamp(): string {
        return new Date().toISOString();
    }

    private getColoredContext(context: string): string {
        // Add ANSI color codes for consistent coloring
        return `\x1B[33m[${context}]\x1B[0m`; // Yellow color for context
    }

    private formatMessage(level: string, message: string, context?: string): string {
        const timestamp = this.getTimestamp();
        const contextStr = context ? this.getColoredContext(context) : '';
        return `${timestamp} ${level} ${contextStr} ${message}`;
    }

    log(message: string, context?: string) {
        console.log(this.formatMessage('\x1B[32mLOG\x1B[0m', message, context));
    }

    error(message: string, trace?: string, context?: string) {
        console.error(this.formatMessage('\x1B[31mERROR\x1B[0m', message, context));
        if (trace) {
            console.error('\x1B[31m', trace, '\x1B[0m');
        }
    }

    warn(message: string, context?: string) {
        console.warn(this.formatMessage('\x1B[33mWARN\x1B[0m', message, context));
    }

    debug(message: string, context?: string) {
        if (process.env.NODE_ENV !== 'production') {
            console.debug(this.formatMessage('\x1B[36mDEBUG\x1B[0m', message, context));
        }
    }

    verbose(message: string, context?: string) {
        if (process.env.NODE_ENV !== 'production') {
            console.log(this.formatMessage('\x1B[34mVERBOSE\x1B[0m', message, context));
        }
    }
}