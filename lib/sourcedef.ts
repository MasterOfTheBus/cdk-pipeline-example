export class CodeStarConnectionDef {
    public codeStarConnection: string;
    public repo: string;
    public repoOwner: string;

    constructor(codeStarConnection: string, repo: string, repoOwner: string) {
        this.codeStarConnection = codeStarConnection;
        this.repo = repo;
        this.repoOwner = repoOwner;
    }
};
