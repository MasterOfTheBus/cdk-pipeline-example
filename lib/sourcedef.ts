export interface CodeStarConnectionDefProps {
    codeStarConnection: string;
    repo: string;
    repoOwner: string;
}

export class CodeStarConnectionDef {
    public codeStarConnection: string;
    public repo: string;
    public repoOwner: string;

    constructor(props: CodeStarConnectionDefProps) {
        this.codeStarConnection = props.codeStarConnection;
        this.repo = props.repo;
        this.repoOwner = props.repoOwner;
    }
};
