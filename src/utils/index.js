// React Libs
import React from "react"
import ReactDOM from "react-dom"

/**
 * 汇率计算
 **/
// 获取所有汇率信息
export const getCurrency = () =>
    fetch(`https://api.coinmarketcap.com/v1/ticker/?limit=0`).then(res => res.json())
// 获取特定汇率
export const getCurrencyOf = ({token, tender}) =>
    fetch(`https://api.coinmarketcap.com/v1/ticker/${token}/${tender ? `?convert=${tender}` : ""}`).then(res => res.json())
// 转换价格
export const calcCoinCurrency = (src, dist) => {
    if (src.type==="token") {
        if (dist.type==="token") {
            // token -> token
            return Promise.all([
                getCurrencyOf({ token: src.id }),
                getCurrencyOf({ token: dist.id })
            ]).then(res => {
                const srcTokenPrice = res[0][0]["price_usd"]
                const distTokenPrice = res[1][0]["price_usd"]
                return srcTokenPrice/distTokenPrice
            })
        } else {
            // token -> tender
            return getCurrencyOf({ token: src.id, tender: dist.symbol }).then(res => {
                return res[0][`price_${dist.id}`]
            })
        }
    } else {
        if (dist.type==="token") {
            // tender -> token
            return getCurrencyOf({ token: dist.id, tender: src.symbol }).then(res => {
                return 1/res[0][`price_${src.id}`]
            })
        } else {
            // tender -> tender
            return Promise.all([
                getCurrencyOf({ token: "bitcoin", tender: src.symbol }),
                getCurrencyOf({ token: "bitcoin", tender: dist.symbol })
            ]).then(res => {
                const srcTenderPrice = res[0][0][`price_${src.id}`]
                const distTenderPrice = res[1][0][`price_${dist.id}`]
                return distTenderPrice/srcTenderPrice
            })
        }
    }
}


/**
 * 字符处理
 **/
// 提取字符中的数字
export const getPriceFrom = (s) => {
    if (!s) return false
    const price = s.toString().split(/\s+/)[0].replace( /[^\d\.]*/g, '')
    return price ? price : false
}

/**
 * 容器节点管理
 **/
// 插入容器节点
export const insertNode = (id, style) => {
    // 移除先前创建的容器
    removeNode(id)
    // 创建容器
    const node = document.createElement('div');
    // 补充 ID
    node.id = id
    // 更新样式
    if (style) {
        for (let key in style) {
            node.style[key] = style[key]
        }
    }
    // 插入节点
    document.body.appendChild(node)
    // 返回引用
    return document.getElementById(id)
}
// 节点是否存在
export const nodeExist = (id) => !!document.getElementById(id)
// 移除节点
export const removeNode = (id) => {
    if (nodeExist(id)) {
        const node = document.getElementById(id)
        ReactDOM.unmountComponentAtNode(node)
        node.remove()
    }
}