module.exports = {
	printWidth: 120, // 超过最大值换行
	tabWidth: 2, // tab缩进大小
	useTabs: true, // 使用tab缩进
	semi: false, // 句尾是否添加分号
	singleQuote: true, // 使用单引号，默认false(对jsx无效, 需要单独配置)
	bracketSpacing: true, // 是否在对象，数组括号与文字之间加空格
	bracketSameLine: true, // 禁止将>单独放一行（html、vue、jsx）
	arrowParens: 'avoid', // 箭头函数参数只有一个时是否要有小括号，可选avoid -> 省略括号
	trailingComma: 'none' // 行尾不添加逗号，可选 none|es5|all
}
