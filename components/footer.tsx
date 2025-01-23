import { CSSProperties } from 'react'

const Footer = () => {
	return (
		<footer style={styles.footer}>
			<p>Footer &copy; 2025</p>
		</footer>
	)
}

const styles: { footer: CSSProperties } = {
	footer: {
		backgroundColor: '#f4f4f4',
		padding: '10px',
		textAlign: 'center',
		borderTop: '1px solid #ddd',
		position: 'fixed',
		left: '0',
		bottom: '0',
		width: '100%',
	},
}

export default Footer
