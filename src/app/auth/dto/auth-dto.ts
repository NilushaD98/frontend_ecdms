export class LoginRequestDTO{
    constructor(
        public username:string,
        public password:string
    ) {
    }
}

export class StandardResponse{
    code:number;
    message:string;
    data:object;
}

export class RolesAndPrivilegesDTO{
    roles:string[];
    privileges:string[];
}
