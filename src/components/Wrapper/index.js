/**
 * 悬浮图标
 * 选中文字出现
 **/

// React Libs
import React, { Fragment } from "react"
import ReactDOM from "react-dom"
// Style
import style from "./index.less"
// AntMotion
import QueueAnim from 'rc-queue-anim'
// Components
import Portal from "@/components/Portal"
import Panel from "@/components/Panel"
// Config
import theme from "@/config/theme"
import { portalAnim, panelAnim } from "@/config/anim"
import { wrapperId, wrapperPositionOffset } from "@/config"
// Utils
import { insertNode, removeNode, getPriceFrom } from "@/utils"

class Wrapper extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            // 显示状态
            showPortal: false,
            showPanel: false,
            // 定位
            position: { top:0, left: 0},
            // 价格
            price: 0
        }
    }

    componentDidMount() {
        // 监听鼠标抬起，获取选中文字, 插入容器
        document.addEventListener('mouseup', this.handleTextSelect, false)
    }

    // 获取输入文字
	handleTextSelect = (e) => {
	    // 如果点击的区域位于 wrapper 之外， 则开始处理
	    if (e.target && !e.target.closest(`#${wrapperId}`)) {
		    // 获取选择对象
		    const selection = window.getSelection()
		    const selectionPos = selection.getRangeAt(0).getBoundingClientRect()
		    // 获取鼠标点击价格数字
		    const price = getPriceFrom(selection)
		    // 插入悬浮按钮
		    if (price) {
			    this.handleShowPortal(selectionPos.top+selectionPos.height+window.scrollY, selectionPos.left+selectionPos.width/2-18, price)
		    } else {
			    this.handleHidePortal()
		    }
	    }
    }

    // 显示控制
    handleShowPortal = (top, left, price) => {
        this.setState({
            showPortal: true,
            position: { top, left },
            price
        })
    }
    handleHidePortal = () => {
        this.setState({
            showPortal: false
        })
    }
    handleShowPanel = () => {
        this.setState({
            showPortal: false,
            showPanel: true
        })
    }
    handleHidePanel = () => {
        this.setState({
            showPanel: false
        })
    }

    render() {
        const { showPortal, showPanel, position, price } = this.state
        const { top, left } = position
        return (
            <Fragment>

                {/*悬浮按钮*/}
                <QueueAnim animConfig={portalAnim}>
                    {
                        showPortal &&
                        <div key="portal" className={style.floatContainer} style={{ top, left }} onClick={this.handleShowPanel}>
                            <Portal/>
                        </div>
                    }
                </QueueAnim>

                {/*悬浮面板*/}
                { showPanel && <div className={style.overlay} onClick={this.handleHidePanel}/> }
	            <QueueAnim animConfig={panelAnim}>
	                {
	                    showPanel &&
	                    <div key="panel" className={style.floatContainer} style={{ top, left }}>
	                        <Panel price={price}/>
	                    </div>
	                }
	            </QueueAnim>

            </Fragment>
        )
    }
}

/**
 * 节点插入
 **/
// 插入容器
export const insertWrapper = () => {
    ReactDOM.render(<Wrapper/>, insertNode(wrapperId))
}
// 移除容器
export const removeWrapper = () => removeNode(wrapperId)