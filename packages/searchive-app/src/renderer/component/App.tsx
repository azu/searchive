// MIT © 2017 azu
import * as React from "react";

import { SearchiveDocument } from "searchive-client";

const fuzzyFilterFactory = require("react-fuzzy-filter");
// these components share state and can even live in different components
const { InputFilter, FilterResults } = fuzzyFilterFactory();

export interface AppProps {
    items: SearchiveDocument[];
}

export class App extends React.Component<AppProps, {}> {
    state = {
        items: []
    };

    componentDidMount() {
        console.log(`file://${__dirname}/package.json`);
        console.log("Reauest", `http://localhost:12347/api/search?text=Java`);
        // fetch(`http://localhost:12347/api/search?text=Java`)
        //     .then(res => res.json())
        //     .then((results: SearchiveDocument[]) => {
        //         this.setState({
        //             items: results
        //         });
        //     });
    }

    render() {
        const items = this.state.items;
        const fuseConfig = {
            findAllMatches: true,
            keys: ["title", "body", "author", "filePath"]
        };
        return (
            <div>
                <InputFilter debounceTime={200} />
                <FilterResults items={items} fuseConfig={fuseConfig}>
                    {(filteredItems: any) => {
                        return (
                            <div>
                                {filteredItems.map((item: any) => {
                                    return (
                                        <div key={item.id}>
                                            <h1>
                                                <a href={item.filePath} title={item.title}>
                                                    {item.title ? `${item.title}#${item.pageNumber}` : item.id}
                                                </a>
                                            </h1>
                                            <p>{item.body}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    }}
                </FilterResults>
            </div>
        );
    }
}
