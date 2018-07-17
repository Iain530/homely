class BoxLink extends React.Component {
    render() {
        return (
            <a class="remove-style" href="{this.props.url}">
                <div class="box-link">
                    <img src="https://s2.googleusercontent.com/s2/favicons?domain_url={this.props.url}"/>
                    <div>{this.props.title}</div>
                </div>
            </a>
        );
    }
}
