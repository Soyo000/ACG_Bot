//AC自动机(基于字典树)

//节点
class TrieNode{
    constructor(value){
        this.value = value;//节点字符值
        this.num = 1;//有多少子字符串
        this.deep = 0;//深度
        this.son = [];//子节点
        this.isEnd = false;//是否为叶子节点
        this.false = null;//失败指针
    }
    //查找子节点
    findNode(value){
        for(let i=0,len = this.son.length;i<len;i++){
            const node=this.son[i];
            if(node.value == value){
                return node;
            }
        }
        return null;
    }
}

//树
class Trie {
    constructor(){
        this.root = new TrieNode(null);
        this.size = 1;//节点总数
    }
    insert(str){
        let node = this.root;
        for(let i = 0,len = str.length;i < len;i++){
            let snode = node.findNode(str[i]);
            if(snode==null){
                snode = new TrieNode(str[i]);
                snode.deep = node.deep+1;
                node.son.push(snode);
                this.size++;
            }else{
                node.num++;
            }
            node = snode;
        }
        if(!node.isEnd){
            node.isEnd = true
        }
    }
    has(str){
        let node = this.root;
        for(let i = 0,len = str.length;i<len;i++){
            const snode = node.findNode(str[i]);
            if(snode){
                node = snode;
            }else{
                return false;
            }
        }
        return node.isEnd;
    }
}
//构建失败指针
function build_ac_automation(root){
    root.fail = null;
    const queue = [root];
    let i = 0;
    while(i<queue.length){
        const temp = queue[i];
        for(let j = 0,len = temp.son.length;j<len;j++){
            const node = temp.son[j];
            if(temp===root){
                node.fail = root;
            }else{
                node.fail = temp.fail.findNode(node.value)||root;
            }
            queue.push(node);
        }
        i++;
    }
}
//AC自动机实现多字符查询
function acSearch(list,str){
    //生成字典树
    const trie = new Trie();
    list.forEach(element => {
        trie.insert(element);
    });
    build_ac_automation(trie.root);
    let node =trie.root;
    let data = [];
    for(let i = 0,len = str.length;i<len;i++){
        let cnode = node.findNode(str[i]);
        while(!cnode&&node!==trie.root){
            node = node.fail;
            cnode = node.findNode(str[i]);
        }
        if(cnode){
            node = cnode;
        }
        if(node.isEnd){
            data.push({
                start:i+1-node.deep,
                len:node.deep,
                str:str.substr(i+1-node.deep,node.deep),
                num:node.num,
            })
        }
    }
    return data;
}

module.exports = {
    Trie,
    acSearch,
};
