// https://prettier.io/docs/en/options.html

module.exports = {
    semi: true, // 行尾不加分号
    printWidth: 120, // 语句长度超过120将换行
    singleQuote: true, // 使用单引号
    bracketSpacing: true, // 对象字面量前后不加空格 true-{ foo: bar } false-{foo: bar}
    arrowParens: "always" // 箭头函数的参数是否总是被（）包裹 "avoid"- x => x "always"-(x) => x
}
