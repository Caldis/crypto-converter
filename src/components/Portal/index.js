/**
 * 悬浮按钮
 * 选中文字出现
 **/

// React Libs
import React from "react"
// MaterialUI Components
import Button from 'material-ui/Button';
// MaterialUI Icons
import TimeLine from 'material-ui-icons/TimeLine';
// Style
import style from "./index.less"

export default class Portal extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className={style.portal}>
                <Button fab color="primary" aria-label="add">
                    <TimeLine />
                    <div>查看当前价格</div>
                </Button>
            </div>
        )
    }
}