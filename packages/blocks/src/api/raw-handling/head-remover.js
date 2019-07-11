// eslint-disable-next-line valid-jsdoc
/**
 * @type {import('./').NodeFilterFunc}
 */
export default function( node ) {
	if (
		node.nodeName !== 'SCRIPT' &&
		node.nodeName !== 'NOSCRIPT' &&
		node.nodeName !== 'TEMPLATE' &&
		node.nodeName !== 'STYLE'
	) {
		return;
	}

	node.parentNode.removeChild( node );
}
