function GameRules() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">游戏规则</h2>
      
      <div className="space-y-4 text-sm">
        <section>
          <h3 className="font-bold text-lg mb-2">基本规则</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>玩家和AI各有50点初始生命值</li>
            <li>每回合各持有3张颜色互不相同的牌</li>
            <li>点击卡牌即可出牌</li>
          </ul>
        </section>

        <section>
          <h3 className="font-bold text-lg mb-2">卡牌说明</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>卡牌有三种颜色：红、蓝、黑</li>
            <li>每张卡牌的数值范围：2-7</li>
          </ul>
        </section>

        <section>
          <h3 className="font-bold text-lg mb-2">颜色相克</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>红色克制蓝色</li>
            <li>蓝色克制黑色</li>
            <li>黑色克制红色</li>
            <li>被克制的牌数值减3（最低为0）</li>
          </ul>
        </section>

        <section>
          <h3 className="font-bold text-lg mb-2">回合结算</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>数值高的一方获胜</li>
            <li>造成等同于数值的伤害</li>
            <li>回合结束后补充手牌</li>
          </ul>
        </section>

        <section>
          <h3 className="font-bold text-lg mb-2">胜利条件</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>对方生命值降至0或以下时获胜</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default GameRules;
