const evalExpression = (expr) => {
    try {
        return eval(expr);
    } catch (error) {
        return expr;
    }
};

module.exports = evalExpression;