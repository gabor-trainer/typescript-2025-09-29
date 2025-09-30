// the following line is a smoke test to verify the linter is working, must be red.
// change var -> const and remove the comment to fix it.
const greeting = "Hello, Professional TypeScript 2!"

function showGreeting(msg: string) {
    console.log(msg)
}

showGreeting(greeting);

export { };