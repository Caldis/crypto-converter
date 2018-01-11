/**
 * 悬浮面板
 * 呈现内容
 **/

// React Libs
import React from "react"
// Style
import style from "./index.less"
// AntMotion
import QueueAnim from 'rc-queue-anim'
// MaterialUI Components
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import Tooltip from 'material-ui/Tooltip'
import { CircularProgress } from 'material-ui/Progress'
// MaterialUI Icons
import CompareArrows from 'material-ui-icons/CompareArrows'
// Components
import CoinSelector from "./CoinSelector"
// Config
import { tenderList, defCoinRight } from "@/config"
import { initOverlayAnim, overlayAnim } from "@/config/anim"
// Utils
import { getCurrency, calcCoinCurrency } from "@/utils"

export default class Panel extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // 加载
            loading: true,
            // 汇率信息
            currencyData: [],
            // 价格
            priceLeft: "",
            priceRight: "",
            // 汇率
            currency: 1,
            // 币种
            coinLeft: "",
            coinRight: defCoinRight,
            // 代币列表
            tokenList: [],
            // 法币列表
            tenderList: tenderList,
        }
    }

    componentWillMount() {
        this.initData()
    }

    // 初始化价格信息
    initData = () => {
        const { price } = this.props
        const { coinRight } = this.state
        getCurrency().then(res => {
            const tokenList = res.map(item => ({
                id: item.id,
                type: "token",
                name: item.name,
                symbol: item.symbol
            }))
            this.setState({
                loading: false,
                currencyData: res,
                coinLeft: tokenList[0],
                tokenList
            },() => {
                this.setState({
                    loading: true,
                    coinLeft: tokenList[0]
                },() => {
                    calcCoinCurrency(tokenList[0], coinRight).then(res => {
                        this.setState({
                            loading: false,
                            priceLeft: price,
                            priceRight: price*res,
                            currency: res
                        })
                    })
                })
            })
        })
    }

    // 输入价格
    handlePriceLeftInput = (e) => {
        const { currency } = this.state
        this.setState({
            priceLeft: e.target.value,
            priceRight: e.target.value*currency
        })
    }
    handlePriceRightInput = (e) => {
        const { currency } = this.state
        this.setState({
            priceLeft: e.target.value/currency,
            priceRight: e.target.value
        })
    }

    // 更新币种
    handleUpdateCoinLeft = (coin) => {
        const { coinRight, priceRight } = this.state
        this.setState({
            loading: true,
            coinLeft: coin
        },() => {
            calcCoinCurrency(coin, coinRight).then(res => {
                this.setState({
                    loading: false,
                    priceLeft: priceRight/res,
                    currency: res
                })
            })
        })
    }
    handleUpdateCoinRight = (coin) => {
        const { coinLeft, priceLeft } = this.state
        this.setState({
            loading: true,
            coinRight: coin
        },() => {
            calcCoinCurrency(coinLeft, coin).then(res => {
                this.setState({
                    loading: false,
                    priceRight: priceLeft*res,
                    currency: res
                })
            })
        })
    }

    // 交换币种
    handleCoinSwap = () => {
        const { coinLeft, coinRight, currency, priceLeft, priceRight } = this.state
        this.setState({
            priceLeft: priceRight,
            priceRight: priceLeft,
            currency: 1/currency,
            coinLeft: coinRight,
            coinRight: coinLeft,
        })
    }

    render() {
        const { popup } = this.props
        const { loading, currencyData, currency, priceLeft, priceRight, coinLeft, coinRight, tokenList, tenderList } = this.state
        return (
            <div className={popup ? style.panelOnPopup : style.panel}>

                {/*加载叠层*/}

                <QueueAnim animConfig={currencyData.length===0 ? initOverlayAnim : overlayAnim}>
                    {
                        (loading || currencyData.length===0) &&
                        <div key="overlay" className={style.loadingOverlay}>
                            <CircularProgress style={{ color: "white" }} />
                        </div>
                    }
                </QueueAnim>

                {/*转换面板*/}
                <div className={style.converterContainer}>
                    <div className={style.left}>
                        {/*价格输入*/}
                        <TextField className={style.priceInput} value={parseFloat(priceLeft).toFixed(8)} onChange={this.handlePriceLeftInput}/>
                        {/*币种选择*/}
                        <CoinSelector coin={coinLeft} updateCoin={this.handleUpdateCoinLeft} tokenList={tokenList} tenderList={tenderList}/>
                    </div>
                    <div className={style.center}>
                        <Tooltip title="交换币种">
                            <Button className={style.swapButton} fab color="primary" aria-label="add" onClick={this.handleCoinSwap}>
                                <CompareArrows/>
                            </Button>
                        </Tooltip>
                    </div>
                    <div className={style.right}>
                        {/*价格输入*/}
                        <TextField className={style.priceInput} value={parseFloat(priceRight).toFixed(8)} onChange={this.handlePriceRightInput}/>
                        {/*币种选择*/}
                        <CoinSelector coin={coinRight} updateCoin={this.handleUpdateCoinRight} tokenList={tokenList} tenderList={tenderList}/>
                    </div>
                </div>

                {/*汇率信息*/}
                <div className={style.currencyDetail}>
                    <span>汇率信息: 1 {coinLeft.symbol || coinLeft} = {parseFloat(currency).toFixed(8)} {coinRight.symbol}</span>
                </div>

            </div>
        )
    }
}