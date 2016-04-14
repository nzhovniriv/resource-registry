<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "parameter".
 *
 * @property integer $parameter_id
 * @property string $value
 * @property integer $resource_id
 * @property integer $attribute_id
 *
 * @property ResourceAttribute $attribute
 * @property Resource $resource
 */
class Parameter extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'parameter';
    }
    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['value', 'resource_id', 'attribute_id'], 'required'],
            [['resource_id', 'attribute_id'], 'integer'],
            [['value'], 'string', 'max' => 45]
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'parameter_id' => 'Parameter ID',
            'value' => 'Value',
            'resource_id' => 'Resource ID',
            'attribute_id' => 'Attribute ID',
        ];
    }
	
    public function getResource(){
        return $this->hasOne(Resource::className(), ['resource_id' => 'resource_id']);
    }
    public function getResourceAttribute(){
        return $this->hasOne(ResourceAttribute::className(), ['attribute_id' => 'attribute_id']);
    }
	public function getAttributeName($attributeId){
		return ResourceAttribute::findOne($attributeId)->name;
	}
}