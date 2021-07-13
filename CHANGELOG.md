# Changelog

All notable changes to this project will be documented in this file.

The format is based (loosely) on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres (or at least tries its very best) to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2021-07-12

### Added

- Support for TypeScript components via `--extension tsx`
- Support for `forwardRef` components via `--type forward-ref`
- Support for indexed multi-file components via `--index` (see changed section below for details)
-

### Changed

- **BREAKING:** Drop support for Node 10
- **BREAKING:** `functional` components now created by default
- **BREAKING:** Components no longer created in a separate sub-directory by default. To opt-in to the old behavior, use the new `--index` option

## [1.1.2] - 2018-09-20

- Fork and initial release
