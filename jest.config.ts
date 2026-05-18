import nextJest from "next/jest.js";
import type { Config } from "jest";

const createJestConfig = nextJest({
	dir: "./",
});

const customJestConfig: Config = {
	testEnvironment: "jest-environment-jsdom",
	setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/$1",
	},
};

export default createJestConfig(customJestConfig);
