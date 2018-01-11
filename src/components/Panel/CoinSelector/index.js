/**
 * 币种选择
 **/

// React Libs
import React from "react"
import ReactDOM from "react-dom"
// Style
import style from "./index.less"
// MaterialUI
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Popover from 'material-ui/Popover';
import Radio from 'material-ui/Radio';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';

export default class CoinSelector extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            // 浮层
            showPopover: false,
            anchorEl: null,
            // 币种类型
            coinType: 'token',
            // 过滤器
            tokenFilterText: "",
            tenderFilterText: ""
        }
    }

    // 弹出层
    handleShowPopover = () => {
        this.setState({
            showPopover: true,
            anchorEl: ReactDOM.findDOMNode(this.button),
        },() => {
            console.log(this.refs.searchBox)
        })
    }
    handleHidePopover = () => {
        this.setState({ showPopover: false })
    }

    // 选择币种类型
    handleCoinTypeSelect = (e) => {
        this.setState({ coinType: e.target.value })
    }

    // 输入过滤文字
    handleTokenFilterInput = (e) => {
        this.setState({
            tokenFilterText: e.target.value.toUpperCase(),
        })
    }
    handleTenderFilterInput = (e) => {
        this.setState({
            tenderFilterText: e.target.value.toUpperCase(),
        })
    }

    // 更新选择币种
    handleCoinSelect = (coin) => {
        this.props.updateCoin(coin)
        this.setState({
            showPopover: false
        });
    }

    // 生成列表
    buildFilteredTokenList = () => {
        const { tokenList } = this.props
        const { tokenFilterText } = this.state
        return (
            tokenFilterText!=="" ?
                tokenList.filter(token => {
                    return token.name.match(tokenFilterText) || token.symbol.match(tokenFilterText)
                }).map(token =>
                    <List key={token.id} onClick={() => this.handleCoinSelect(token)}>
                        <ListItem button>
                            <ListItemText inset primary={token.symbol} secondary={token.name}/>
                        </ListItem>
                    </List>
                ) :
                tokenList.map((token, index) =>
                    index<10 &&
                        <List key={token.id} onClick={() => this.handleCoinSelect(token)}>
                            <ListItem button>
                                <ListItemText inset primary={token.symbol} secondary={token.name}/>
                            </ListItem>
                        </List>
                )
        )

    }
    buildFilteredTenderList = () => {
        const { tenderList } = this.props
        const { tenderFilterText } = this.state
        return (
            tenderFilterText!=="" ?
                tenderList.filter(tender => {
                    return tender.symbol.match(tenderFilterText)
                }).map(tender =>
                    <List key={tender.id} onClick={() => this.handleCoinSelect(tender)}>
                        <ListItem button>
                            <ListItemText inset primary={tender.symbol}/>
                        </ListItem>
                    </List>
                ) :
                tenderList.map(tender =>
                    <List key={tender.id} onClick={() => this.handleCoinSelect(tender)}>
                        <ListItem button>
                            <ListItemText inset primary={tender.symbol} />
                        </ListItem>
                    </List>
                )
        )
    }

    render() {
        const { coin } = this.props
        const { showPopover, anchorEl, coinType, tokenFilterText, tenderFilterText } = this.state
        return (
            <div className={style.coinSelector}>

                {/*展示按钮*/}
                <Button
                    className={style.coinButton}
                    onClick={this.handleShowPopover}
                    ref={node => this.button = node}
                >{coin.symbol || "..."}</Button>

                {/*弹出层*/}
                <Popover
                    open={showPopover}
                    onClose={this.handleHidePopover}
                    anchorEl={anchorEl}
                    anchorReference={"anchorEl"}
                    anchorPosition={{ top: 200, left: 400 }}
                    anchorOrigin={{vertical: "bottom", horizontal: "center"}}
                    transformOrigin={{vertical: "top", horizontal: "center"}}
                >
                    <div className={style.listContainer}>

                        {/*类型选择*/}
                        <div className={style.typeSelector}>
                            <div className={style.type}>
                                <span>代币</span>
                                <Radio className={style.radio} checked={coinType==='token'} onChange={this.handleCoinTypeSelect} value="token"/>
                            </div>
                            <div className={style.type}>
                                <span>法币</span>
                                <Radio className={style.radio} checked={coinType==='tender'} onChange={this.handleCoinTypeSelect} value="tender"/>
                            </div>
                            <div className={style.typeFilterContainer}>
                                <TextField
                                    autoFocus={true}
                                    className={style.typeFilter}
                                    label="输入币种名称搜索更多"
                                    value={coinType==='token' ? tokenFilterText : tenderFilterText}
                                    onChange={coinType==='token' ? this.handleTokenFilterInput : this.handleTenderFilterInput}
                                />
                            </div>
                        </div>

                        {/*币种列表*/}
                        <div className={style.coinList}>
                            { coinType==='token'  && this.buildFilteredTokenList() }
                            { coinType==='tender' && this.buildFilteredTenderList() }
                        </div>

                    </div>
                </Popover>

            </div>
        )
    }
}