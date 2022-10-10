# hibernate-unmapped-objects

[![Github actions](https://github.com/detomarco/hibernate-unmapped-objects/actions/workflows/publish.yml/badge.svg?branch=main)](https://github.com/detomarco/hibernate-unmapped-objects/actions/workflows/publish.yml)
[![Github actions](https://github.com/detomarco/hibernate-unmapped-objects/actions/workflows/lint.yml/badge.svg?branch=main)](https://github.com/detomarco/hibernate-unmapped-objects/actions/workflows/lint.yml)
[![Github actions](https://github.com/detomarco/hibernate-unmapped-objects/actions/workflows/codeql.yml/badge.svg?branch=main)](https://github.com/detomarco/hibernate-unmapped-objects/actions/workflows/codeql.yml)

[![codecov](https://codecov.io/gh/detomarco/hibernate-unmapped-objects/branch/main/graph/badge.svg?token=V9O1K5K98V)](https://codecov.io/gh/detomarco/hibernate-unmapped-objects)

Detect tables and columns that are no longer used in the code base

### Output
![readme_output.png](images/readme_output.png)

## Requirements

- Node 14

## Setup

1. Create config file
   - Rename `.huo.json.tmp` in `.huo.json` and fill with the required data 

## Run with Node

1. Install dependencies
```bash
npm install 
```
2. Run application
```shell
npm start   
```

