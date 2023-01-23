import { injectGlobal } from '@modou/css-in-js'

import './reset-antd.css'

injectGlobal`
  #root,
  #simulator_pc_root{
    height: 100%;
  }
`

// 优化滚动条样式
injectGlobal`
	::-webkit-scrollbar {
		width: 6px;
    height: 6px;
	}

	/* 设置滚动条的背景颜色 */
	::-webkit-scrollbar-track {
		background: #f1f1f1;
    width: 6px;
    height: 6px;
	}

	/* 设置滚动条的滑块（滑轮）的颜色 */
	::-webkit-scrollbar-thumb {
		background: #888;
	}

	/* 设置滑块（滑轮）在滚动时的颜色 */
	::-webkit-scrollbar-thumb:hover {
		background: #555;
	}
`
