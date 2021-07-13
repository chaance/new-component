import * as React from "react";
import styles from "./COMPONENT_NAME.STYLE_EXT";

class COMPONENT_NAME extends React.PureComponent<
	COMPONENT_NAMEProps,
	COMPONENT_NAMEState,
	COMPONENT_NAMEState
> {
	render() {
		let props = this.props;
		return <div {...props} />;
	}
}

export { COMPONENT_NAME };

interface COMPONENT_NAMEOwnProps {}
interface COMPONENT_NAMEDomProps
	extends Omit<
		React.ComponentPropsWithoutRef<"div">,
		keyof COMPONENT_NAMEOwnProps
	> {}
interface COMPONENT_NAMEProps
	extends COMPONENT_NAMEOwnProps,
		COMPONENT_NAMEDomProps {}
interface COMPONENT_NAMEState {}
