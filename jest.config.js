export default {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['./test/setup.jest.ts'],
    moduleNameMapper: {
        '^\\$lib(.*)$': '<rootDir>/src/lib$1',
        '^\\$components(.*)$': '<rootDir>/src/components$1',
        '^test(.*)$': '<rootDir>/test$1',
    },
};