import { injectGlobal } from '@modou/css-in-js'

const ANT_FORM = '.ant-form'
injectGlobal`
	${ANT_FORM} {
		${ANT_FORM}-small {
			${ANT_FORM}-item-control {
				${ANT_FORM}-input-content {
					display: flex;
				}
			}
		}
	}
`
