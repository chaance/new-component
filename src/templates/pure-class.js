import * as React from "react";
import styles from "./COMPONENT_NAME.STYLE_EXT";

class COMPONENT_NAME extends React.PureComponent {
	render() {
		let props = this.props;
		return <div {...props} />;
	}
}

export { COMPONENT_NAME };
