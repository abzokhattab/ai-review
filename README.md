# AI Generated Code Review

## Description:
Generate a code review before commiting and pushing git changes using GPT-3. 

## Install and Usage:
- To install the package globally, use the following command:
```
npm i -g ai-review
```
- To use you own OpenAI key, use the following command in bash:
```
export OPENAI_API_KEY=XXXXXXXXX
```
- To use the tool, execute the following command inside the project that you want to make the review on:
```
ai-review
```

## Show cases: 


|Bad Practice Scenario| Changes| Review  |
|--|--|--|
| Callback hell | ![First case input](./showcases/first-case-input.png)  |![First case output](./showcases/first-case-output.png)  |
| Hardcoded token | ![Second case input](./showcases/second-case-input.png)  |![Second case output](./showcases/second-case-output.png)  |


